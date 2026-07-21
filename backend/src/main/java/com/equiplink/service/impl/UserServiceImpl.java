package com.equiplink.service.impl;

import com.equiplink.dto.request.ChangePasswordRequest;
import com.equiplink.dto.request.UpdateProfileRequest;
import com.equiplink.dto.response.UserResponse;
import com.equiplink.entity.User;
import com.equiplink.exception.ResourceNotFoundException;
import com.equiplink.mapper.UserMapper;
import com.equiplink.repository.UserRepository;
import com.equiplink.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service implementation for managing User profile updates and credentials.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    log.info("Auto-provisioning user record for authenticated email: {}", email);
                    User newUser = User.builder()
                            .email(email)
                            .firstName(email.contains("@") ? email.substring(0, email.indexOf('@')) : "User")
                            .lastName("Member")
                            .password(passwordEncoder.encode("localpassword"))
                            .role(com.equiplink.entity.enums.UserRole.OWNER)
                            .enabled(true)
                            .emailVerified(true)
                            .build();
                    return userRepository.save(newUser);
                });
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhone(request.phone());
        user.setCompanyName(request.companyName());
        user.setGstin(request.gstin());
        user.setBusinessType(request.businessType());
        user.setCompanyAddress(request.companyAddress());
        user.setCity(request.city());
        user.setState(request.state());
        user.setPincode(request.pincode());

        userRepository.save(user);
        log.info("Profile updated for user: {}", email);

        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        log.info("Password successfully changed for user: {}", email);
    }
}
